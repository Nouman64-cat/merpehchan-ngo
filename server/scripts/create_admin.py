"""Sets (or resets) the admin credentials used to log in to the admin API.

Run with the venv active from the `server/` directory:

    python -m scripts.create_admin

This prompts for a username and password, hashes the password with bcrypt,
and writes ADMIN_USERNAME / ADMIN_PASSWORD_HASH into .env. It also generates
a JWT_SECRET_KEY if one isn't already set, since a login is useless without
a secret to sign tokens with.
"""

import getpass
import secrets
from pathlib import Path

from app.security import hash_password

ENV_PATH = Path(__file__).resolve().parent.parent / ".env"


def _read_env_lines() -> list[str]:
    if not ENV_PATH.exists():
        return []
    return ENV_PATH.read_text().splitlines()


def _set_env_var(lines: list[str], key: str, value: str) -> list[str]:
    prefix = f"{key}="
    for index, line in enumerate(lines):
        if line.startswith(prefix):
            lines[index] = f"{key}={value}"
            return lines
    lines.append(f"{key}={value}")
    return lines


def main() -> None:
    username = input("Admin username: ").strip()
    if not username:
        raise SystemExit("Username cannot be empty.")

    password = getpass.getpass("Admin password: ")
    confirm = getpass.getpass("Confirm password: ")
    if not password:
        raise SystemExit("Password cannot be empty.")
    if password != confirm:
        raise SystemExit("Passwords do not match.")

    lines = _read_env_lines()
    lines = _set_env_var(lines, "ADMIN_USERNAME", username)
    lines = _set_env_var(lines, "ADMIN_PASSWORD_HASH", hash_password(password))

    has_jwt_secret = any(
        line.startswith("JWT_SECRET_KEY=") and line.strip() != "JWT_SECRET_KEY="
        for line in lines
    )
    if not has_jwt_secret:
        lines = _set_env_var(lines, "JWT_SECRET_KEY", secrets.token_hex(32))

    ENV_PATH.write_text("\n".join(lines) + "\n")
    print(f"\nSaved admin credentials for '{username}' to {ENV_PATH}")


if __name__ == "__main__":
    main()

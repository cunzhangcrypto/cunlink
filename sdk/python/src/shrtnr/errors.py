# Copyright 2026 Oddbit (https://oddbit.id)
# SPDX-License-Identifier: Apache-2.0

"""Error surface for the shrtnr SDK.

Every non-2xx response raises :class:`ShrtnrError` carrying the HTTP status
and the parsed server message. Network failures are wrapped in
``ShrtnrError(status=0, ...)``.
"""

from __future__ import annotations


class ShrtnrError(Exception):
    """Raised when the shrtnr API returns a non-2xx response or a network error occurs."""

    def __init__(self, status: int, server_message: str) -> None:
        self.status = status
        self.server_message = server_message
        super().__init__(f"shrtnr API error (HTTP {status}): {server_message}")

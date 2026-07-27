"""Shared HTTP exception helpers for consistent API error responses."""

from fastapi import HTTPException, status


def unauthorized(detail: str = "Could not validate credentials") -> HTTPException:
    """
    Build a 401 Unauthorized HTTPException.

    Args:
        detail: Human-readable error message.

    Returns:
        HTTPException: Exception ready to be raised by services or dependencies.
    """
    return HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=detail)


def forbidden(detail: str = "Insufficient permissions") -> HTTPException:
    """
    Build a 403 Forbidden HTTPException.

    Args:
        detail: Human-readable error message.

    Returns:
        HTTPException: Exception ready to be raised by services or dependencies.
    """
    return HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=detail)


def not_found(resource: str = "Resource") -> HTTPException:
    """
    Build a 404 Not Found HTTPException.

    Args:
        resource: Name of the missing entity.

    Returns:
        HTTPException: Exception ready to be raised by services or dependencies.
    """
    return HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"{resource} not found",
    )


def bad_request(detail: str) -> HTTPException:
    """
    Build a 400 Bad Request HTTPException for business-rule violations.

    Args:
        detail: Human-readable error message.

    Returns:
        HTTPException: Exception ready to be raised by services or dependencies.
    """
    return HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=detail)


def conflict(detail: str) -> HTTPException:
    """
    Build a 409 Conflict HTTPException.

    Args:
        detail: Human-readable error message.

    Returns:
        HTTPException: Exception ready to be raised by services or dependencies.
    """
    return HTTPException(status_code=status.HTTP_409_CONFLICT, detail=detail)

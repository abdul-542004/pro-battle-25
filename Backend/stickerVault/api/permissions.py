from rest_framework import permissions

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to allow only owners of a sticker to edit or delete it.
    """

    def has_object_permission(self, request, view, obj):
        # Read-only permissions for any request
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions only for the owner of the sticker
        return obj.owner == request.user

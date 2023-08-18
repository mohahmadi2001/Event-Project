from rest_framework import permissions

class IsStudentWithNumber(permissions.BasePermission):
    """
    Custom permission to only allow users who are students with a student number.
    """

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.is_student
            and request.user.student_number is not None
        )

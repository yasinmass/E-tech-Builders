from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import LoginSerializer, UserSerializer


class LoginView(APIView):
    """
    POST /api/login/
    Public endpoint — returns JWT access + refresh tokens on valid credentials.
    """

    permission_classes = [AllowAny]

    def post(self, request):
        print(f"DEBUG: Login attempt for user: {request.data.get('username')}")
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            print("DEBUG: Login successful")
            return Response(serializer.validated_data, status=status.HTTP_200_OK)
        
        print(f"DEBUG: Login failed. Errors: {serializer.errors}")
        return Response(
            {"detail": serializer.errors.get("non_field_errors", ["Invalid credentials."])[0]},
            status=status.HTTP_401_UNAUTHORIZED,
        )


class LogoutView(APIView):
    """
    POST /api/logout/
    Blacklists the provided refresh token, effectively logging out.
    """

    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
        except Exception:
            pass
        return Response({"detail": "Successfully logged out."}, status=status.HTTP_200_OK)


class MeView(APIView):
    """
    GET /api/me/
    Returns the currently authenticated user's details.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

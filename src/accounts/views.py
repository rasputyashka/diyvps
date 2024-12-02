from rest_framework import generics
from rest_framework import status
from rest_framework.response import Response
from rest_framework.authentication import authenticate
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from django.contrib.auth import logout, login
from django.views.decorators.csrf import csrf_exempt


from .serializers import UserRegistrationSerializer, UserLoginSerializer


class RegisterView(generics.CreateAPIView):
    serializer_class = UserRegistrationSerializer


class LoginView(generics.GenericAPIView):
    serializer_class = UserLoginSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        print(request.user)
        if serializer.is_valid(raise_exception=True):
            username = serializer.data['username']
            password = serializer.data['password']
            user = authenticate(request, username=username, password=password)
            login(request, user)
            if user:
                return Response(
                    {'message': 'logged in successfully'},
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    {'message': 'bad credentials'},
                    status=status.HTTP_400_BAD_REQUEST,
                )


class LogoutView(APIView):
    @csrf_exempt
    def get(self, request):
        logout(request)
        return Response(
            {'message': 'logged out successfully'}, status=status.HTTP_200_OK
        )

from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group

from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ['url', 'username', 'email', 'password']


class UserRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        user = get_user_model().objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
        )
        return user


class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField(
        max_length=50, style={'placeholder': 'Username'}
    )
    password = serializers.CharField(
        style={'input_type': 'password', 'placeholder': 'Password'}
    )


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['url', 'name']

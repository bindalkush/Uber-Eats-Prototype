# backend/api/serializers.py
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Customer, Restaurant, Dish, Cart, Order, Address

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class CustomerSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Customer
        fields = ('id', 'user', 'date_of_birth', 'city', 'state', 'country', 'phone', 'profile_picture')

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = UserSerializer().create(user_data)
        customer = Customer.objects.create(user=user, **validated_data)
        return customer

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', None)
        if user_data:
            user_serializer = UserSerializer(instance=instance.user, data=user_data, partial=True)
            if user_serializer.is_valid(raise_exception=True):
                user_serializer.save()

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance
    
class RestaurantSerializer(serializers.ModelSerializer):
    user = UserSerializer()  # Include UserSerializer to handle user data

    class Meta:
        model = Restaurant
        fields = ('id', 'user', 'name', 'address', 'description', 'cuisine_type', 'profile_picture')

    def create(self, validated_data):
        user_data = validated_data.pop('user')  # Extract user data
        user = UserSerializer().create(user_data)  # Create user using UserSerializer
        restaurant = Restaurant.objects.create(user=user, **validated_data)  # Create restaurant with user
        return restaurant

    def update(self, instance, validated_data):
        # If user fields need to be updated, we would handle them here
        user_data = validated_data.pop('user', None)
        if user_data:
            # Optionally update user details
            user_serializer = UserSerializer(instance=instance.user, data=user_data, partial=True)
            if user_serializer.is_valid(raise_exception=True):
                user_serializer.save()
            
        # Update the restaurant instance with the rest of the validated data
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance


class DishSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dish
        fields = ['id', 'name', 'description', 'price', 'ingredients', 'image', 'category', 'restaurant']

    def create(self, validated_data):
        return Dish.objects.create(**validated_data)

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance



class CartSerializer(serializers.ModelSerializer):
    dish_name = serializers.CharField(source='dish.name', read_only=True)
    price = serializers.DecimalField(source='dish.price', max_digits=10, decimal_places=2, read_only=True)
    restaurant_name = serializers.CharField(source='dish.restaurant.name', read_only=True)
    class Meta:
        model = Cart
        fields = ['id', 'dish_name','price', 'quantity', 'restaurant_name']



class OrderSerializer(serializers.ModelSerializer):
    ordered_items = serializers.SerializerMethodField()  # Serializes the ordered items (Cart items)
    restaurant_name = serializers.CharField(source='restaurant.name', read_only=True)
    delivery_address = serializers.SerializerMethodField()
    # delivery_address = serializers.CharField(source='delivery_address.address')
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2)
    order_status = serializers.CharField()  # Include order status in the serialized data
    delivery_option = serializers.CharField()
    order_delivery_status = serializers.CharField()

    class Meta:
        model = Order
        fields = ['id', 'created_at', 'total_price', 'restaurant_name', 'delivery_address', 'ordered_items', 'order_status', 'delivery_option','order_delivery_status']

    def get_restaurant_name(self, obj):
        # Get unique restaurant names from the order items
        return obj.get_restaurants()
    
    def get_ordered_items(self, obj):
        # If items is stored as a list (JSONField), just return the list
        return obj.items
    
    def get_delivery_address(self, obj):
        # If it's a pickup order, don't include the delivery address at all
        if obj.delivery_option == 'pickup':
            return None
        # If it's a delivery order, return the address (check if it exists)
        return obj.delivery_address.address if obj.delivery_address else None

  
        
  


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ['id', 'address', 'city', 'state', 'postal_code', 'country']



    


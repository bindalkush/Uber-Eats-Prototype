
# 🚀 Uber Eats Prototype - Lab 2

### **Group 10**
- **Sushma Tacholi Kudai** (017519060)  
- **Shobhita Agrawal** (017552795)  
- **Kush Bindal** (017441359)  

---

## 📚 Table of Contents
1. [Project Overview](#project-overview)  
2. [Technologies Used](#technologies-used)  
3. [Setup and Deployment](#setup-and-deployment)  
   - [Part 1: Dockerizing and Kubernetes Setup](#part-1-dockerizing-and-kubernetes-setup)  
   - [Part 2: Kafka Integration](#part-2-kafka-integration)  
   - [Part 3: MongoDB Integration](#part-3-mongodb-integration)  
   - [Part 4: Redux Integration](#part-4-redux-integration)  
4. [Contributors](#contributors)  

---

## 💡 Project Overview
This project extends the Uber Eats Prototype, emphasizing the integration of Docker, Kubernetes, Kafka, MongoDB, and Redux for a scalable and distributed application.

**Key Features:**
- Efficient deployment with Docker and Kubernetes.
- Asynchronous messaging using Kafka.
- Secure data storage using MongoDB.
- Centralized state management with Redux.

---

## 🛠️ Technologies Used
- **Backend**: Python, Django, MongoDB  
- **Frontend**: React, Redux  
- **Event Streaming**: Kafka, Zookeeper  
- **Deployment**: Docker, Kubernetes  
- **Database**: MongoDB Atlas  

---

## ⚙️ Setup and Deployment

### **Part 1: Dockerizing and Kubernetes Setup**

#### **Docker Setup**
1. Build Docker images:
   ```bash
   docker build -t backend:latest ./backend
   docker build -t frontend:latest ./frontend
   ```
2. Run containers locally:
   ```bash
   docker-compose up --build
   ```

#### **Kubernetes Deployment**
1. Start Minikube and configure Docker:
   ```bash
   minikube start
   eval $(minikube docker-env)
   ```
2. Build and load images into Minikube:
   ```bash
   docker build -t backend:latest ./backend
   minikube image load backend:latest
   docker build -t frontend:latest ./frontend
   minikube image load frontend:latest
   ```
3. Apply Kubernetes configurations:
   ```bash
   kubectl apply -f k8s/backend-deployment.yml
   kubectl apply -f k8s/backend-service.yml
   ```
4. Access services:
   ```bash
   minikube service backend-service
   ```

---

### **Part 2: Kafka Integration**
1. Install Kafka and dependencies:
   ```bash
   pip install confluent-kafka
   ```
2. Start Zookeeper and Kafka servers:
   ```bash
   bin/zookeeper-server-start.sh config/zookeeper.properties
   bin/kafka-server-start.sh config/server.properties
   ```
3. Run Kafka producer and consumer:
   ```bash
   python order_consumer.py
   ```

---

### **Part 3: MongoDB Integration**
1. Configure MongoDB in `settings.py`:
   ```python
   DATABASES = {
       'default': {
           'ENGINE': 'djangomi',
           'NAME': 'ubereats',
           'CLIENT': {
               'host': 'mongodb+srv://<username>:<password>@<cluster-url>/ubereats',
               'username': '<username>',
               'password': '<password>',
               'authSource': 'admin',
           }
       }
   }
   ```
2. Install packages:
   ```bash
   pip install django pymongo dnspython bcrypt
   ```
3. Apply migrations:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

---

### **Part 4: Redux Integration**
1. Install Redux dependencies:
   ```bash
   npm install @reduxjs/toolkit react-redux redux-thunk
   ```
2. Centralize state management in `src/store` with reducers and actions. Use `dispatch` to update state:
   ```javascript
   dispatch({ type: 'SET_SESSION_TOKEN', payload: response.data.access });
   ```

---

## 🤝 Contributors
- **Sushma Tacholi Kudai**  
- **Shobhita Agrawal**  
- **Kush Bindal**  

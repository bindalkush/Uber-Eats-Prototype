

// Initial state
const initialState = {
  sessionToken: '',
  restaurants: [],
  menu: [],
  orders: []  // Add this new field to store orders
};

// Reducer function
const restaurantReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_SESSION_TOKEN':
      console.log(action.payload, "test")
      return {
        ...state,
        sessionToken: action.payload
      };
    case 'SET_RESTAURANTS':
      return {
        ...state,
        restaurants: action.payload
      };
    case 'ADD_RESTAURANT':
      return {
        ...state,
        restaurants: [...state.restaurants, action.payload]
      };
    case 'SET_MENU':
      return {
        ...state,
        menu: action.payload
      };
    case 'ADD_MENU_ITEM':
      return {
        ...state,
        menu: [...state.menu, action.payload]
      };
  

      case 'UPDATE_ORDER_STATUS':
        console.log(action.payload);
        const orderExists = state.orders.some(order => order.orderId === action.payload[0].orderId);
        if (orderExists) {
          return {
            ...state,
            orders: state.orders.map(order => 
              order.orderId === action.payload[0].orderId 
                ? { ...order, order_status: action.payload[0].newStatus, delivery_status: action.payload[0].newDeliveryStatus }
                : order
            )
          };
        } else {
          console.log("test")
          return {
            ...state,
            orders: [...state.orders, {
              orderId: action.payload[0].orderId,
              order_status: action.payload[0].newStatus,
              delivery_status: action.payload[0].newDeliveryStatus
            }]
          };
        }
    default:
      return state;
  }
};

export default restaurantReducer;
export const initialState = {
    role:localStorage.getItem('role')
};


const auth = (state = initialState, action) => {
    switch (action.type) {
        case'SET_ROLE':
           return state.role = action.payload
        case'RESET_ROLE':
           return state.role = ''
        default:
            return state;
    }
};
export default auth
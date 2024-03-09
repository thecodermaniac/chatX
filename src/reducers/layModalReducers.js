function modalReducers(state, action) {
  switch (action.type) {
    case "changeSidebar":
      return { ...state, isSideBarOpen: action.payload };

    case "changeChat":
      return { ...state, isChatOpen: action.payload };

    case "changeRequest":
      return { ...state, isRequestOpen: action.payload };
    default:
      return { ...state };
  }
}

export default modalReducers;

export interface LayoutState {
  isSideBarOpen: boolean;
  isChatOpen: boolean;
  isRequestOpen: boolean;
}

export type LayoutAction =
  | { type: "changeSidebar"; payload: boolean }
  | { type: "changeChat"; payload: boolean }
  | { type: "changeRequest"; payload: boolean };

function modalReducers(state: LayoutState, action: LayoutAction): LayoutState {
  switch (action.type) {
    case "changeSidebar":
      return { ...state, isSideBarOpen: action.payload };

    case "changeChat":
      return { ...state, isChatOpen: action.payload };

    case "changeRequest":
      return { ...state, isRequestOpen: action.payload };
    default:
      return state;
  }
}

export default modalReducers;
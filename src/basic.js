import $ from 'jquery';

export const apiGet = (dbname) => {
	return $.get(`DBs/${dbname}.json`);
}

export const storeState = () => {
  let currentState = {};
  return (stateChangeFunction) => {
    const newState = stateChangeFunction(currentState);
    currentState = {...newState};
    return newState;
  }
}

export const changeStateAdd = (prop) => {
  return (value) => {
    return (state) => ({
      ...state,
      [prop] : (state[prop] || 0) + value
    })
  }
}

export const changeStateReplaceArray = (props) => {
  return (values) => {
    return (state) => {
      const recur = (state, i) => {
        if (i > props.length) { return state }
        const newState = {
          ...state,
          [props[i]] : values[i]
        };
        return recur(newState, i+1);
      }
      return recur(state, 0);
    }
  }
}

export const changeStateReplaceWholeObj = (obj) => {
  return (state) => ({
    ...obj
  });
}

export const changeStateReplace = (prop) => {
  return (value) => {
    return (state) => ({
      ...state,
      [prop] : value
    })
  }
}

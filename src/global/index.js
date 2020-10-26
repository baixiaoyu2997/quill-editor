export const globals = {
  SHOW_TITLE: false,
  CAN_SUBMIT: false,
};
export const setGlobal = (name, value) => {
  return globals[name] = value
};

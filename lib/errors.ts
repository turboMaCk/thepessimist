export interface Error {
    name : string;
    message : string;
};

export const NumberArgument : Error = {
    name: "NumberArgument",
    message: "Number values not allowed. Please provide a string instead."
};

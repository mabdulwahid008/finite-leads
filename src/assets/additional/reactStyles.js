export const reactStyles = {
    control: (baseStyles, state) => {
        return {
        ...baseStyles,
        borderColor: state.isFocused ? '#757575' : '#c2c2c2',
        boxShadow: 'none',
      }}
}
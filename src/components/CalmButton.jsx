const CalmButton = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false, 
  disabled = false,
  type = 'button',
  onClick = null
}) => {
  const classNames = `calm-btn calm-btn--${variant} calm-btn--${size} ${fullWidth ? 'calm-btn--full' : ''}`
  
  return (
    <button 
      className={classNames}
      type={type}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default CalmButton

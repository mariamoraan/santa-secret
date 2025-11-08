import './button.css'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean
  children?: React.ReactNode | string
  disabled?: boolean
  isIcon?: boolean
  isText?: boolean
}

export const Button = (props: ButtonProps) => {
    const {
      isLoading,
      children,
      isIcon,
      isText
    } = props;

    return (
        <button 
        {...props} 
        className={`
          button ${props.className || ''} 
          ${isIcon ? 'button--icon' : ''}
          ${isText ? 'button--text' : ''}
        `} 
        disabled={props.disabled || isLoading}
        >
            {children}
            {isLoading ? <span className='loader' /> : null}
        </button>
    )
}
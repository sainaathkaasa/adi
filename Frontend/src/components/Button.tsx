
const Button = ({text, className, func}) => {
  return (
    <button className={className} onClick={func}>Reset</button>
  )
}

export default Button
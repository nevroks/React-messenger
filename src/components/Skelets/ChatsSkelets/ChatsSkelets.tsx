import React from "react"
import ContentLoader from "react-content-loader"


interface chatSkeletsProps {
  className: string
}


const ChatsSkelets:React.FC<chatSkeletsProps> = ({className}) => (
  <ContentLoader 
  className={className}
    speed={2}
    width={300}
    height={70}
    viewBox="0 0 300 70"
    backgroundColor="#c5c4c4"
    foregroundColor="#ecebeb"
  >
    <rect x="67" y="7" rx="12" ry="12" width="228" height="24" /> 
    <circle cx="32" cy="34" r="27" /> 
    <circle cx="43" cy="46" r="6" /> 
    <rect x="157" y="46" rx="0" ry="0" width="0" height="2" /> 
    <rect x="69" y="39" rx="13" ry="13" width="224" height="21" /> 
    <rect x="159" y="50" rx="0" ry="0" width="17" height="2" />
  </ContentLoader>
)

export default ChatsSkelets

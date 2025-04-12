import ContentLoader from "react-content-loader"

interface MessagesSkeletsProps {
  className: string
}


const MessagesSkelets: React.FC<MessagesSkeletsProps> = ({ className }) => (
  <ContentLoader
    className={className}
    speed={2}
    width={300}
    height={70}
    viewBox="0 0 300 70"
    backgroundColor="#c5c4c4"
    foregroundColor="#ecebeb"
  >
    <rect x="70" y="1" rx="12" ry="12" width="228" height="68" /> 
    <circle cx="32" cy="34" r="27" /> 
    <circle cx="43" cy="46" r="6" />
  </ContentLoader>
)

export default MessagesSkelets
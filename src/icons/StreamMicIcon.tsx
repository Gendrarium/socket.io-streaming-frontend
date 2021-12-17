interface IIconProps {
  className: string;
  fill: string;
}

const Icon: React.FC<IIconProps> = ({ className, fill }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 13 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="6.5" cy="6.5" r="5" className={fill} strokeWidth="3" />
    </svg>
  );
};

export default Icon;

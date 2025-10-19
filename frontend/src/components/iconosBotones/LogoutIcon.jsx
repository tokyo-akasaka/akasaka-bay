// frontend/src/components/iconosBotones/LogoutIcon.js

export const LogoutIcon = (props) => (
  <svg
    id="Layer_1"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    x="0px"
    y="0px"
    viewBox="0 0 512 512"
    xmlSpace="preserve"
    width={props.width || 24}
    height={props.height || 24}
    {...props}
  >
    {/* Flecha roja */}
    <path
      fill="#C00D0D"
      d="M152,280h278.1l-31,31c-9.4,9.4-9.4,24.6,0,33.9c9.4,9.4,24.6,9.4,33.9,0l72-72
         c9.4-9.4,9.4-24.6,0-33.9l-72-72c-9.4-9.4-24.6-9.4-33.9,0c-9.4,9.4-9.4,24.6,0,33.9l31,31H152
         c-13.3,0-24,10.7-24,24C128,269.3,138.7,280,152,280z"
    />
    {/* Marco gris */}
    <path
      fill="#A9A8AE"
      d="M24,40h304c13.3,0,24,10.7,24,24v96c0,13.3-10.7,24-24,24s-24-10.7-24-24V88H48v336h256v-72
         c0-13.3,10.7-24,24-24s24,10.7,24,24v96c0,13.3-10.7,24-24,24H24C10.7,472,0,461.3,0,448V64C0,50.7,10.7,40,24,40z"
    />
  </svg>
);

export default LogoutIcon;

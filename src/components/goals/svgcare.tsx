import React from "react";
import { COLORS } from "../../CONSTANTS";

interface SVGCareProps {
  disabled: boolean;
  selected: boolean;
}

export default function SVGCare({ disabled, selected }: SVGCareProps) {
  return (
    <svg
      enableBackground="new 0 0 510.976 510.976"
      className="w-8"
      viewBox="0 0 510.976 510.976"
    >
      <g>
        <path
          d="m341.405 94.459-.155-2.264h-40.813l-.153 1.341c-1.395 12.251 8.188 22.986 20.518 22.986 11.962.001 21.421-10.13 20.603-22.063z"
          fill={disabled ? COLORS.DISABLED : selected ? "#ffb69e" : COLORS.DEFAULT}
        />
        <g>
          <g id="XMLID_5475_">
            <g id="XMLID_5477_">
              <path
                d="m294.584 483.083c-12.715 0-23.021-10.307-23.021-23.021v-184.015c0-12.714 10.307-23.021 23.021-23.021s23.021 10.307 23.021 23.021v184.014c.001 12.715-10.306 23.022-23.021 23.022z"
                fill={disabled ? COLORS.DISABLED : selected ? "#ffb69e" : COLORS.DEFAULT}
              />
            </g>
            <g id="XMLID_5476_">
              <path
                d="m350.568 483.083c-12.715 0-23.021-10.307-23.021-23.021v-184.015c0-12.714 10.307-23.021 23.021-23.021s23.021 10.307 23.021 23.021v184.014c0 12.715-10.306 23.022-23.021 23.022z"
                fill={disabled ? COLORS.DISABLED : selected ? "#ffb69e" : COLORS.DEFAULT}
              />
            </g>
          </g>
          <circle cx="322.576" cy="39.761" fill={disabled ? COLORS.DISABLED : selected ? "#ffb69e" : "gray"} r="39.761" />
          <path
            d="m445.606 257.936c-.214-.584-29.961-82.814-29.961-82.814l-22.255-.378-13.19 15.208s29.157 80.581 29.369 81.16c3.644 9.967 14.671 15.063 24.606 11.43 9.951-3.638 15.069-14.655 11.431-24.606z"
            fill={disabled ? COLORS.DISABLED : selected ? "#ffb69e" : COLORS.DEFAULT}
          />
          <path
            d="m260.748 201.681c.2-.56 5.459-15.3 5.459-15.3l-9.521-16.281h-25.216l-1.314 3.144-63.158-12.27c-10.396-2.021-20.47 4.772-22.491 15.174-2.021 10.401 4.773 20.471 15.175 22.491 82.816 15.965 79.619 15.769 83.015 15.769 7.964 0 15.281-4.982 18.051-12.727z"
            fill={disabled ? COLORS.DISABLED : selected ? "#faab91" : COLORS.DEFAULT}
          />
          <path
            d="m376.816 180.478c1.114 3.124 3.384 9.474 3.384 9.474l35.445-14.83s-11.42-32.094-15.475-43.892c-8.9-25.902-23.825-39.035-44.359-39.035h-14.561c.224 10.849-9.879 20.01-20.428 20.01-11.305 0-19.698-9.127-20.385-20.01h-11.097c-20.533 0-35.458 13.133-44.358 39.034-2.084 6.065-13.513 38.872-13.513 38.872l34.737 16.281 2.155-6.055-22.196 128.083c-1.132 6.53 3.923 12.49 10.501 12.49h131.818c6.599 0 11.634-5.952 10.501-12.49z"
            fill={disabled ? COLORS.DISABLED : selected ? COLORS.BLUE : COLORS.DISABLED}
          />
          <path
            d="m361.185 148.702h-31.055c-1.937 0-3.507 1.57-3.507 3.507v5.87c0 1.937 1.57 3.507 3.507 3.507h31.055c1.937 0 3.507-1.57 3.507-3.507v-5.87c0-1.937-1.57-3.507-3.507-3.507z"
            fill={disabled ? COLORS.DISABLED : selected ? "#fff" : COLORS.DEFAULT}
          />
          <g>
            <path
              d="m99.473 246.177h146.377v125.773h-146.377z"
              fill={disabled ? COLORS.DISABLED : selected ? "#b4d7dc" : COLORS.DEFAULT}
            />
            <path
              d="m261.659 229.481c-21.705-32.648-35.932-32.648-40.607-32.648-20.488 0-76.313 0-97.247 0-4.673 0-18.894 0-40.634 32.634-2.663 3.997-8.947 13.851-13.559 24.355-3.067 6.985 14.206 12.52 14.206 12.52s17.21 1.635 19.196-2.378c1.822-3.681 4.275-8.113 7.457-13.084 5.656-8.833 10.585-14.551 13.751-17.6v124.902h96.34l-.148-125.105c3.15 2.998 8.166 8.779 13.93 17.802 2.7 4.227 4.874 8.064 6.581 11.381 2.489 4.835 20.199 3.012 20.199 3.012s17.12-4.466 14.059-11.451c-4.6-10.497-10.868-20.344-13.524-24.34z"
              fill={disabled ? COLORS.DISABLED : selected ? "#e64937" : COLORS.DISABLED}
            />
            <path
              d="m124.229 339.619v29.979h96.34l-.028-29.979z"
              fill={disabled ? COLORS.DISABLED : selected ? "#55696e" : COLORS.DISABLED}
            />
            <ellipse
              cx="172.399"
              cy="170.101"
              fill={disabled ? COLORS.DISABLED : selected ? "#80391b" : "gray"}
              rx="37.542"
              ry="37.542"
              transform="matrix(.998 -.071 .071 .998 -11.625 12.649)"
            />
            <path
              d="m249.245 479.788h-153.692c-4.202 0-7.61 3.407-7.61 7.61s3.407 7.61 7.61 7.61h153.693c4.202 0 7.61-3.407 7.61-7.61s-3.408-7.61-7.611-7.61z"
              fill={disabled ? COLORS.DISABLED : selected ? "#6c9baa" : COLORS.DEFAULT}
            />
            <path
              d="m249.245 368.689h-153.692c-4.202 0-7.61 3.407-7.61 7.61s3.407 7.61 7.61 7.61h153.693c4.202 0 7.61-3.407 7.61-7.61-.001-4.203-3.408-7.61-7.611-7.61z"
              fill={disabled ? COLORS.DISABLED : selected ? "#6c9baa" : COLORS.DEFAULT}
            />
            <g>
              <g>
                <path
                  d="m133.06 476.106-20.514-115.96c-1.844-10.426 5.112-20.372 15.537-22.216 10.424-1.845 20.372 5.112 22.216 15.538l20.514 115.96c1.844 10.425-5.112 20.372-15.537 22.216-10.409 1.843-20.369-5.096-22.216-15.538z"
                  fill={disabled ? COLORS.DISABLED : selected ? "#748488" : COLORS.DEFAULT}
                />
              </g>
              <g>
                <path
                  d="m189.523 491.644c-10.425-1.844-17.382-11.791-15.537-22.216l20.513-115.96c1.844-10.426 11.791-17.385 22.216-15.538 10.425 1.844 17.382 11.791 15.537 22.216l-20.513 115.96c-1.842 10.413-11.778 17.385-22.216 15.538z"
                  fill={disabled ? COLORS.DISABLED : selected ? "#748488" : COLORS.DEFAULT}
                />
              </g>
            </g>
            <g>
              <path
                d="m245.326 322.458c-6.304 0-11.414 5.11-11.414 11.414v165.689c0 6.304 5.11 11.414 11.414 11.414s11.414-5.11 11.414-11.414v-165.688c0-6.304-5.11-11.415-11.414-11.415z"
                fill={disabled ? COLORS.DISABLED : selected ? "#3c5a73" : COLORS.DEFAULT}
              />
              <path
                d="m264.005 350.96c-4.202 0-7.61 3.407-7.61 7.61v116.406c0 4.203 3.407 7.61 7.61 7.61s7.61-3.407 7.61-7.61v-116.407c-.001-4.203-3.408-7.609-7.61-7.609z"
                fill={disabled ? COLORS.DISABLED : selected ? "#6c9baa" : "gray"}
              />
              <path
                d="m99.473 322.458c-6.304 0-11.414 5.11-11.414 11.414v165.689c0 6.304 5.11 11.414 11.414 11.414s11.414-5.11 11.414-11.414v-165.688c0-6.304-5.11-11.415-11.414-11.415z"
                fill={disabled ? COLORS.DISABLED : selected ? "#3c5a73" : COLORS.DEFAULT}
              />
              <path
                d="m80.793 350.96c-4.202 0-7.61 3.407-7.61 7.61v116.406c0 4.203 3.407 7.61 7.61 7.61s7.61-3.407 7.61-7.61v-116.407c0-4.203-3.408-7.609-7.61-7.609z"
                fill={disabled ? COLORS.DISABLED : selected ? "#6c9baa" : "gray"}
              />
            </g>
            <g fill={disabled ? COLORS.DISABLED : selected ? "#80391b" : "gray"}>
              <path d="m114.87 325.19-15.686-52.136c.614-1.953 1.853-5.074 3.84-9.087l-33.403-10.143c-3.019 6.876-5.318 14.027-5.418 20.001-.038 1.768.188 3.57.724 5.354l16.84 55.97c2.737 9.099 12.349 14.336 21.531 11.572 9.142-2.75 14.322-12.39 11.572-21.531z" />
              <path d="m280.595 273.825c-.1-5.974-2.395-13.126-5.408-20.001-43.862 10.805-30.588 7.535-34.258 8.439 2.489 4.834 3.99 8.565 4.686 10.786l-15.688 52.141c-2.75 9.141 2.431 18.781 11.572 21.531 9.122 2.744 18.775-2.411 21.531-11.572l16.84-55.97c.537-1.784.763-3.587.725-5.354z" />
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
}

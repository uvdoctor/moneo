import React from "react";
import { COLORS } from "../CONSTANTS";

interface SVGPayProps {
  disabled: boolean;
  selected: boolean;
}

export default function SVGPay({disabled, selected}: SVGPayProps) {
  return (
    <svg
      enableBackground="new 0 0 512 512"
      className="w-8"
      viewBox="0 0 512 512"
    >
      <g>
        <g>
          <path
            d="m382.517 91.217h-253.034l-129.483 129.483v70.6l129.483 129.483h253.034l129.483-129.483v-70.6z"
            fill={disabled ? COLORS.DISABLED : selected ? COLORS.GREEN : COLORS.LIGHT_GRAY}
          />
          <path
            d="m256 91.217v329.566h126.517l129.483-129.484v-70.599l-129.483-129.483z"
            fill={disabled ? COLORS.DISABLED : selected ? COLORS.GREEN : COLORS.LIGHT_GRAY}
          />
          <path
            d="m512 291.3c-75.961-11.072-140.555 53.523-129.483 129.483h112.479c9.391 0 17.003-7.613 17.003-17.003v-112.48z"
            fill={disabled ? COLORS.DISABLED : selected ? COLORS.BLUE : COLORS.DEFAULT}
          />
          <path
            d="m494.997 91.217h-112.48c-11.072 75.961 53.522 140.555 129.483 129.483v-112.479c0-9.391-7.613-17.004-17.003-17.004z"
            fill={disabled ? COLORS.DISABLED : selected ? COLORS.BLUE : COLORS.DEFAULT}
          />
          <g fill={disabled ? COLORS.DISABLED : selected ? COLORS.BLUE : COLORS.DEFAULT}>
            <path d="m129.483 91.217h-112.48c-9.39 0-17.003 7.613-17.003 17.004v112.479c75.961 11.072 140.555-53.522 129.483-129.483z" />
            <path d="m129.483 420.783c11.072-75.961-53.522-140.556-129.483-129.483v112.48c0 9.391 7.613 17.003 17.003 17.003z" />
          </g>
        </g>
        <path
          d="m273.615 241.835c-11.186-3.954-23.535-8.713-30.311-14.027-1.474-1.156-2.104-4.328-1.498-7.542.329-1.748 1.856-7.586 7.685-9.342 10.661-3.211 17.898.992 20.515 2.948 6.634 4.959 16.035 3.603 20.996-3.032 4.96-6.635 3.603-16.035-3.032-20.996-2.59-1.936-8.824-6.035-17.747-8.364v-3.204c0-8.284-6.716-15-15-15s-15 6.716-15 15v4.131c-14.326 4.572-24.993 16.881-27.899 32.302-2.727 14.47 2.049 28.535 12.465 36.704 10.163 7.97 24.667 13.701 38.827 18.707 10.583 3.741 10.898 11.822 10.144 16.306-1.274 7.577-7.649 15.766-18.636 15.839-11.737.07-15.089-.451-23.925-6.23-6.932-4.535-16.229-2.591-20.764 4.341-4.535 6.933-2.591 16.229 4.341 20.765 9.675 6.329 16.984 9.172 25.447 10.36v3.584c0 8.284 6.716 15 15 15s15-6.716 15-15v-5.165c18.543-5.949 30.401-22.339 33.121-38.519 3.708-22.051-8.24-41.97-29.729-49.566z"
          fill={disabled ? COLORS.DISABLED : selected ? "white" : COLORS.DEFAULT}
        />
        <g fill={disabled ? COLORS.DISABLED : selected ? "white" : COLORS.DEFAULT}>
          <path d="m273.615 241.835c-5.879-2.078-12.072-4.38-17.615-6.866v32.381c2.532.952 5.079 1.874 7.616 2.77 10.583 3.741 10.898 11.822 10.144 16.306-1.239 7.37-7.319 15.297-17.76 15.792v47.826c7.921-.406 14.224-6.939 14.224-14.961v-5.165c18.543-5.949 30.401-22.339 33.121-38.519 3.707-22.049-8.241-41.968-29.73-49.564z" />
          <path d="m256 163.316v46.477c7.099-.327 11.965 2.552 14.007 4.078 6.634 4.959 16.035 3.603 20.996-3.032 4.96-6.635 3.603-16.035-3.032-20.996-2.59-1.936-8.824-6.035-17.747-8.364v-3.204c0-8.021-6.303-14.553-14.224-14.959z" />
        </g>
      </g>
    </svg>
  );
}

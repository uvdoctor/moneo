import React from "react";
import { COLORS } from "../CONSTANTS";

interface SVGListProps {
  disabled: boolean;
  selected: boolean;
}
export default function SVGList({ disabled, selected }: SVGListProps) {
  return (
    <svg
      viewBox="-81 0 512 512"
      className="w-8"
    >
      <path
        d="m334.738281 512h-319.621093c-8.347657 0-15.117188-6.769531-15.117188-15.117188v-399.527343c0-8.351563 6.769531-15.117188 15.117188-15.117188h319.621093c8.351563 0 15.121094 6.765625 15.121094 15.117188v399.527343c0 8.347657-6.769531 15.117188-15.121094 15.117188zm0 0"
        fill={disabled ? COLORS.DISABLED : selected ? "#f2f6fc" : COLORS.LIGHT_GRAY}
      />
      <path
        d="m334.738281 82.238281h-159.808593v429.761719h159.808593c8.351563 0 15.121094-6.769531 15.121094-15.117188v-399.527343c0-8.351563-6.769531-15.117188-15.121094-15.117188zm0 0"
        fill={disabled ? COLORS.DISABLED : selected ? "#e5eaf5" : COLORS.LIGHT_GRAY}
      />
      <path
        d="m174.929688 0c-25.6875 0-46.582032 20.894531-46.582032 46.582031v15.148438c0 8.347656 6.769532 15.117187 15.117188 15.117187h62.925781c8.351563 0 15.117187-6.769531 15.117187-15.117187v-15.148438c0-25.6875-20.894531-46.582031-46.578124-46.582031zm16.34375 64.757812h-32.691407v-18.175781c0-7.023437 4.421875-13.433593 11.125-15.53125 11.21875-3.511719 21.566407 4.824219 21.566407 15.53125zm0 0"
        fill={disabled ? COLORS.DISABLED : selected ? COLORS.GREEN : COLORS.DEFAULT}
      />
      <path
        d="m191.273438 46.582031v18.175781h-16.34375v12.089844h31.460937c8.351563 0 15.117187-6.769531 15.117187-15.117187v-15.148438c0-25.6875-20.894531-46.582031-46.578124-46.582031v30.238281c9.011718 0 16.34375 7.332031 16.34375 16.34375zm0 0"
        fill={disabled ? COLORS.DISABLED : selected ? COLORS.GREEN : COLORS.DEFAULT}
      />
      <path
        d="m218.875 46.613281h-87.894531c-27.980469 0-50.742188 22.761719-50.742188 50.742188s22.761719 50.742187 50.742188 50.742187h87.894531c27.980469 0 50.746094-22.761718 50.746094-50.742187s-22.765625-50.742188-50.746094-50.742188zm0 0"
        fill={disabled ? COLORS.DISABLED : selected ? COLORS.GREEN : COLORS.DEFAULT}
      />
      <path
        d="m218.875 46.613281h-43.945312v101.484375h43.945312c27.980469 0 50.746094-22.761718 50.746094-50.742187s-22.765625-50.742188-50.746094-50.742188zm0 0"
        fill={disabled ? COLORS.DISABLED : selected ? COLORS.GREEN : COLORS.DEFAULT}
      />
      <path
        d="m86.035156 231.996094c7.90625 0 15.484375-6.953125 15.117188-15.117188-.367188-8.191406-6.644532-15.117187-15.117188-15.117187-7.910156 0-15.484375 6.953125-15.117187 15.117187.363281 8.191406 6.640625 15.117188 15.117187 15.117188zm0 0"
        fill={disabled ? COLORS.DISABLED : selected ? "#fa732d" : COLORS.DEFAULT}
      />
      <path
        d="m263.824219 231.996094h-127.851563c-8.347656 0-15.117187-6.765625-15.117187-15.117188 0-8.347656 6.769531-15.117187 15.117187-15.117187h127.851563c8.347656 0 15.117187 6.769531 15.117187 15.117187 0 8.351563-6.769531 15.117188-15.117187 15.117188zm0 0"
        fill={disabled ? COLORS.DISABLED : selected ? COLORS.BLUE : COLORS.DEFAULT}
      />
      <path
        d="m263.824219 201.761719h-88.894531v30.234375h88.894531c8.347656 0 15.117187-6.765625 15.117187-15.117188 0-8.347656-6.769531-15.117187-15.117187-15.117187zm0 0"
        fill={disabled ? COLORS.DISABLED : selected ? COLORS.BLUE : COLORS.DEFAULT}
      />
      <path
        d="m86.035156 291.261719c7.90625 0 15.484375-6.953125 15.117188-15.117188-.367188-8.191406-6.644532-15.121093-15.117188-15.121093-7.910156 0-15.484375 6.957031-15.117187 15.121093.363281 8.191407 6.640625 15.117188 15.117187 15.117188zm0 0"
        fill={disabled ? COLORS.DISABLED : selected ? "#fa732d" : COLORS.DEFAULT}
      />
      <path
        d="m263.824219 291.261719h-127.851563c-8.347656 0-15.117187-6.769531-15.117187-15.121094 0-8.347656 6.769531-15.117187 15.117187-15.117187h127.851563c8.347656 0 15.117187 6.769531 15.117187 15.117187 0 8.351563-6.769531 15.121094-15.117187 15.121094zm0 0"
        fill={disabled ? COLORS.DISABLED : selected ? COLORS.BLUE : COLORS.DEFAULT}
      />
      <path
        d="m263.824219 261.023438h-88.894531v30.238281h88.894531c8.347656 0 15.117187-6.769531 15.117187-15.121094 0-8.347656-6.769531-15.117187-15.117187-15.117187zm0 0"
        fill={disabled ? COLORS.DISABLED : selected ? COLORS.BLUE : COLORS.DEFAULT}
      />
      <path
        d="m86.035156 350.523438c7.90625 0 15.484375-6.953126 15.117188-15.117188-.367188-8.191406-6.644532-15.117188-15.117188-15.117188-7.910156 0-15.484375 6.953126-15.117187 15.117188.363281 8.191406 6.640625 15.117188 15.117187 15.117188zm0 0"
        fill={disabled ? COLORS.DISABLED : selected ? "#fa732d" : COLORS.DEFAULT}
      />
      <path
        d="m263.824219 350.523438h-127.851563c-8.347656 0-15.117187-6.769532-15.117187-15.117188s6.769531-15.117188 15.117187-15.117188h127.851563c8.347656 0 15.117187 6.769532 15.117187 15.117188s-6.769531 15.117188-15.117187 15.117188zm0 0"
        fill={disabled ? COLORS.DISABLED : selected ? COLORS.BLUE : COLORS.DEFAULT}
      />
      <path
        d="m263.824219 320.289062h-88.894531v30.234376h88.894531c8.347656 0 15.117187-6.769532 15.117187-15.117188s-6.769531-15.117188-15.117187-15.117188zm0 0"
        fill={disabled ? COLORS.DISABLED : selected ? COLORS.BLUE : COLORS.DEFAULT}
      />
      <path
        d="m86.035156 409.789062c7.90625 0 15.484375-6.953124 15.117188-15.121093-.367188-8.191407-6.644532-15.117188-15.117188-15.117188-7.910156 0-15.484375 6.953125-15.117187 15.117188.363281 8.191406 6.640625 15.121093 15.117187 15.121093zm0 0"
        fill={disabled ? COLORS.DISABLED : selected ? "#fa732d" : COLORS.DEFAULT}
      />
      <path
        d="m263.824219 409.789062h-127.851563c-8.347656 0-15.117187-6.769531-15.117187-15.121093 0-8.347657 6.769531-15.117188 15.117187-15.117188h127.851563c8.347656 0 15.117187 6.769531 15.117187 15.117188 0 8.351562-6.769531 15.121093-15.117187 15.121093zm0 0"
        fill={disabled ? COLORS.DISABLED : selected ? COLORS.BLUE : COLORS.DEFAULT}
      />
      <path
        d="m263.824219 379.550781h-88.894531v30.238281h88.894531c8.347656 0 15.117187-6.769531 15.117187-15.121093 0-8.347657-6.769531-15.117188-15.117187-15.117188zm0 0"
        fill={disabled ? COLORS.DISABLED : selected ? COLORS.BLUE : COLORS.DEFAULT}
      />
    </svg>
  );
}

"use client";
import React from "react";
import { Text, View } from "react-native";
import { PrimitiveIcon, UIIcon } from "@gluestack-ui/icon";
import { tva } from "@gluestack-ui/nativewind-utils/tva";
import {
  withStyleContext,
  useStyleContext,
} from "@gluestack-ui/nativewind-utils/withStyleContext";
import { cssInterop } from "nativewind";
import type { VariantProps } from "@gluestack-ui/nativewind-utils";

import { Svg } from "react-native-svg";
const SCOPE = "BADGE";

const badgeStyle = tva({
  base: "flex-row items-center rounded-sm data-[disabled=true]:opacity-50 px-2 py-1",
  variants: {
    action: {
      error: "bg-background-error border-error-300",
      warning: "bg-background-warning border-warning-300",
      success: "bg-background-success border-success-300",
      info: "bg-background-info border-info-300",
      muted: "bg-background-muted border-background-300",
    },
    variant: {
      solid: "",
      outline: "border",
    },
    size: {
      sm: "",
      md: "",
      lg: "",
    },
  },
});

const badgeTextStyle = tva({
  base: "text-typography-700 font-body font-normal tracking-normal uppercase",

  parentVariants: {
    action: {
      error: "text-error-600",
      warning: "text-warning-600",
      success: "text-success-600",
      info: "text-info-600",
      muted: "text-background-800",
    },
    size: {
      sm: "text-2xs",
      md: "text-xs",
      lg: "text-sm",
    },
  },
  variants: {
    isTruncated: {
      true: "web:truncate",
    },
    bold: {
      true: "font-bold",
    },
    underline: {
      true: "underline",
    },
    strikeThrough: {
      true: "line-through",
    },
    sub: {
      true: "text-xs",
    },
    italic: {
      true: "italic",
    },
    highlight: {
      true: "bg-yellow-500",
    },
  },
});

const badgeIconStyle = tva({
  base: "fill-none",
  parentVariants: {
    action: {
      error: "text-error-600",
      warning: "text-warning-600",
      success: "text-success-600",
      info: "text-info-600",
      muted: "text-background-800",
    },
    size: {
      sm: "h-3 w-3",
      md: "h-3.5 w-3.5",
      lg: "h-4 w-4",
    },
  },
});

const ContextView = withStyleContext(View, SCOPE);

cssInterop(PrimitiveIcon, {
  className: {
    target: "style",
    nativeStyleToProp: {
      height: true,
      width: true,
      fill: true,
      color: "classNameColor",
      stroke: true,
    },
  },
});

type IBadgeProps = React.ComponentPropsWithoutRef<typeof ContextView> &
  VariantProps<typeof badgeStyle>;
function Badge({
  children,
  action = "muted",
  variant = "solid",
  size = "md",
  className,
  ...props
}: { className?: string } & IBadgeProps) {
  return (
    <ContextView
      className={badgeStyle({ action, variant, class: className })}
      {...props}
      context={{
        action,
        variant,
        size,
      }}
    >
      {children}
    </ContextView>
  );
}

type IBadgeTextProps = React.ComponentPropsWithoutRef<typeof Text> &
  VariantProps<typeof badgeTextStyle>;

const BadgeText = React.forwardRef<
  React.ComponentRef<typeof Text>,
  IBadgeTextProps
>(function BadgeText({ children, className, size, ...props }, ref) {
  const { size: parentSize, action: parentAction } = useStyleContext(SCOPE);
  return (
    <Text
      ref={ref}
      className={badgeTextStyle({
        parentVariants: {
          size: parentSize,
          action: parentAction,
        },
        size,
        class: className,
      })}
      {...props}
    >
      {children}
    </Text>
  );
});

type IBadgeIconProps = React.ComponentPropsWithoutRef<typeof PrimitiveIcon> &
  VariantProps<typeof badgeIconStyle>;

const BadgeIcon = React.forwardRef<
  React.ComponentRef<typeof Svg>,
  IBadgeIconProps
>(function BadgeIcon({ className, size, ...props }, ref) {
  const { size: parentSize, action: parentAction } = useStyleContext(SCOPE);

  if (typeof size === "number") {
    return (
      <UIIcon
        ref={ref}
        {...props}
        className={badgeIconStyle({ class: className })}
        size={size}
      />
    );
  } else if (
    (props?.height !== undefined || props?.width !== undefined) &&
    size === undefined
  ) {
    return (
      <UIIcon
        ref={ref}
        {...props}
        className={badgeIconStyle({ class: className })}
      />
    );
  }
  return (
    <UIIcon
      className={badgeIconStyle({
        parentVariants: {
          size: parentSize,
          action: parentAction,
        },
        size,
        class: className,
      })}
      {...props}
      ref={ref}
    />
  );
});

type ThirdPartyBadgeIconProps = {
  icon: React.ComponentType<any>;
  size?: number;
  color?: string;
  style?: any;
  className?: string;
  iconProps?: any;
};

const ThirdPartyBadgeIcon = React.forwardRef<any, ThirdPartyBadgeIconProps>(
  function ThirdPartyBadgeIcon(
    {
      icon: IconComponent,
      size,
      color = "currentColor",
      style,
      className,
      iconProps = {},
      ...props
    },
    ref
  ) {
    const { size: parentSize, action: parentAction } = useStyleContext(SCOPE);

    // Determine the actual size to use based on parent context
    const iconSize =
      size || (parentSize === "sm" ? 12 : parentSize === "md" ? 14 : 18);

    // Map parent action to icon color if not explicitly provided
    const iconColor =
      color ||
      (parentAction === "error"
        ? "text-error-600"
        : parentAction === "warning"
        ? "text-warning-600"
        : parentAction === "success"
        ? "text-success-600"
        : parentAction === "info"
        ? "text-info-600"
        : "text-background-800");

    return (
      <View
        ref={ref}
        style={[
          {
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
            marginRight: 4, // Add spacing between icon and text
          },
          style,
        ]}
        className={className}
        {...props}
      >
        <IconComponent
          size={iconSize}
          color={iconColor}
          style={{ alignSelf: "center" }}
          {...iconProps}
        />
      </View>
    );
  }
);
Badge.displayName = "Badge";
BadgeText.displayName = "BadgeText";
BadgeIcon.displayName = "BadgeIcon";
ThirdPartyBadgeIcon.displayName = "BadgeIconChildren";
export { Badge, BadgeIcon, BadgeText, ThirdPartyBadgeIcon };

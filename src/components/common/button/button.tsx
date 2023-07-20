import {PropsWithChildren} from "react";
import {genClassNameString} from "../../../utils";

import styles from "./button.module.scss";

export const enum ButtonVariants {
    Primary = "primary",
    Secondary = "secondary",
    Danger = "danger",
    Variable = "variable",
    Light = "light",
}

type ButtonProps = {
    variant: ButtonVariants;
    width?: string;
    className?: string;
    onClick?: () => void;
}

export const Button = (props: PropsWithChildren<ButtonProps>) => {
    const {children, variant, className, onClick} = props;

    return (
        <button
            className={genClassNameString(styles.btn, styles[`btn_${variant}`], className ?? "")}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

import { typographyProps } from "@/lib/type";
import { cn } from "@/lib/utils";

export const H1 = ({ className, children }: typographyProps) => (
  <h1
    className={cn(
      className,
      "font-montserrat text-2xl md:text-5xl leading-relaxed"
    )}
  >
    {children}
  </h1>
);

export const H2 = ({ className, children }: typographyProps) => (
  <h2
    className={cn(
      className,
      "font-montserrat text-xl md:text-4xl leading-relaxed"
    )}
  >
    {children}
  </h2>
);

export const H3 = ({ className, children }: typographyProps) => (
  <h3
    className={cn(
      className,
      "font-montserrat text-lg md:text-2xl leading-relaxed"
    )}
  >
    {children}
  </h3>
);

export const H4 = ({ className, children }: typographyProps) => (
  <h4
    className={cn(
      className,
      "font-montserrat text-base md:text-xl leading-relaxed"
    )}
  >
    {children}
  </h4>
);

export const H5 = ({ className, children }: typographyProps) => (
  <h5
    className={cn(
      className,
      "font-montserrat text-sm md:text-lg leading-relaxed"
    )}
  >
    {children}
  </h5>
);

export const H6 = ({ className, children }: typographyProps) => (
  <h6
    className={cn(
      className,
      "font-montserrat text-xs md:text-base leading-relaxed"
    )}
  >
    {children}
  </h6>
);

export const P = ({ className, children }: typographyProps) => (
  <p
    className={cn(
      className,
      "font-montserrat text-sm md:text-base leading-normal"
    )}
  >
    {children}
  </p>
);

export const Ul = ({ className, children }: typographyProps) => (
  <ul
    className={cn(
      className,
      "font-montserrat list-disc list-inside text-sm md:text-base leading-normal space-y-2"
    )}
  >
    {children}
  </ul>
);

export const Ol = ({ className, children }: typographyProps) => (
  <ol
    className={cn(
      className,
      "font-montserrat list-decimal list-inside text-sm md:text-base leading-normal space-y-2"
    )}
  >
    {children}
  </ol>
);

export const Blockquote = ({ className, children }: typographyProps) => (
  <blockquote
    className={cn(
      className,
      "font-montserrat italic border-l-4 pl-4 text-gray-600 text-base md:text-lg"
    )}
  >
    {children}
  </blockquote>
);

export const Strong = ({ className, children }: typographyProps) => (
  <strong className={cn(className, "font-semibold text-black")}>
    {children}
  </strong>
);

export const Small = ({ className, children }: typographyProps) => (
  <small
    className={cn(className, "text-xs text-muted-foreground font-montserrat")}
  >
    {children}
  </small>
);

export const Span = ({ className, children }: typographyProps) => (
  <span className={cn(className, "font-montserrat")}>{children}</span>
);

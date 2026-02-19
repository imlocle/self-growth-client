import { colors } from "@ui/theme/colors";
import { typography } from "@ui/theme/typography";
import { spacing } from "@ui/theme/spacing";
import { radius } from "@ui/theme/radius";
import { shadows } from "@ui/theme/shadows";

describe("theme: colors", () => {
  it("exports all required background colors", () => {
    expect(colors.background).toBeDefined();
    expect(colors.backgroundElevated).toBeDefined();
    expect(colors.surface).toBeDefined();
    expect(colors.surfaceElevated).toBeDefined();
  });

  it("exports primary color variants", () => {
    expect(colors.primary).toBe("#7fb069");
    expect(colors.primaryLight).toBeDefined();
    expect(colors.primaryDark).toBeDefined();
    expect(colors.primarySubtle).toBeDefined();
  });

  it("exports semantic colors", () => {
    expect(colors.success).toBeDefined();
    expect(colors.warning).toBeDefined();
    expect(colors.danger).toBeDefined();
    expect(colors.info).toBeDefined();
  });

  it("exports text hierarchy colors", () => {
    expect(colors.text).toBeDefined();
    expect(colors.textSecondary).toBeDefined();
    expect(colors.textMuted).toBeDefined();
    expect(colors.textDisabled).toBeDefined();
  });

  it("all color values are valid hex or rgba strings", () => {
    const hexOrRgba = /^(#[0-9a-fA-F]{6}|rgba?\(.+\))$/;
    Object.entries(colors).forEach(([key, value]) => {
      expect(value).toMatch(hexOrRgba);
    });
  });
});

describe("theme: typography", () => {
  it("exports all heading levels", () => {
    expect(typography.display).toBeDefined();
    expect(typography.h1).toBeDefined();
    expect(typography.h2).toBeDefined();
    expect(typography.h3).toBeDefined();
    expect(typography.h4).toBeDefined();
  });

  it("exports body text variants", () => {
    expect(typography.bodyLarge).toBeDefined();
    expect(typography.body).toBeDefined();
    expect(typography.bodySmall).toBeDefined();
  });

  it("exports button text styles", () => {
    expect(typography.button).toBeDefined();
    expect(typography.buttonSmall).toBeDefined();
  });

  it("all typography entries have fontSize and lineHeight", () => {
    Object.entries(typography).forEach(([key, value]) => {
      expect(value).toHaveProperty("fontSize");
      expect(value).toHaveProperty("lineHeight");
      expect(value.lineHeight).toBeGreaterThan(value.fontSize);
    });
  });

  it("headings have decreasing font sizes", () => {
    expect(typography.display.fontSize).toBeGreaterThan(typography.h1.fontSize);
    expect(typography.h1.fontSize).toBeGreaterThan(typography.h2.fontSize);
    expect(typography.h2.fontSize).toBeGreaterThan(typography.h3.fontSize);
    expect(typography.h3.fontSize).toBeGreaterThan(typography.h4.fontSize);
  });
});

describe("theme: spacing", () => {
  it("exports all spacing values", () => {
    expect(spacing.xs).toBeDefined();
    expect(spacing.sm).toBeDefined();
    expect(spacing.md).toBeDefined();
    expect(spacing.lg).toBeDefined();
    expect(spacing.xl).toBeDefined();
    expect(spacing.xxl).toBeDefined();
    expect(spacing.xxxl).toBeDefined();
  });

  it("spacing values increase monotonically", () => {
    const values = [
      spacing.xxs,
      spacing.xs,
      spacing.sm,
      spacing.md,
      spacing.lg,
      spacing.xl,
      spacing.xxl,
      spacing.xxxl,
      spacing.huge,
      spacing.massive,
    ];
    for (let i = 1; i < values.length; i++) {
      expect(values[i]).toBeGreaterThan(values[i - 1]);
    }
  });
});

describe("theme: radius", () => {
  it("exports all radius values", () => {
    expect(radius.xs).toBeDefined();
    expect(radius.sm).toBeDefined();
    expect(radius.md).toBeDefined();
    expect(radius.lg).toBeDefined();
    expect(radius.pill).toBeDefined();
  });

  it("pill radius is very large for pill shapes", () => {
    expect(radius.pill).toBeGreaterThanOrEqual(999);
  });
});

describe("theme: shadows", () => {
  it("exports shadow levels", () => {
    expect(shadows.sm).toBeDefined();
    expect(shadows.md).toBeDefined();
    expect(shadows.lg).toBeDefined();
    expect(shadows.xl).toBeDefined();
  });

  it("exports glow effects", () => {
    expect(shadows.glow).toBeDefined();
    expect(shadows.glowStrong).toBeDefined();
  });

  it("shadow levels have increasing radius", () => {
    expect(shadows.md.shadowRadius).toBeGreaterThan(shadows.sm.shadowRadius);
    expect(shadows.lg.shadowRadius).toBeGreaterThan(shadows.md.shadowRadius);
    expect(shadows.xl.shadowRadius).toBeGreaterThan(shadows.lg.shadowRadius);
  });

  it("all shadows include elevation for Android", () => {
    expect(shadows.sm.elevation).toBeDefined();
    expect(shadows.md.elevation).toBeDefined();
    expect(shadows.lg.elevation).toBeDefined();
    expect(shadows.xl.elevation).toBeDefined();
  });
});

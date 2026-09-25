/** Structured data for a <script type="application/ld+json"> tag. "<" is escaped so no
 *  value (a plan name from the database, say) can close the script element. */
export const jsonLd = (value: unknown): string => JSON.stringify(value).replace(/</g, "\\u003c");

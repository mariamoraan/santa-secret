declare module '*.module.scss' {
  const classes: { readonly [key: string]: string }
  export default classes
}

declare module '*.scss' {
  const css: { readonly [key: string]: string } | string
  export default css
}

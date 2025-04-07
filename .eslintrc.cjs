module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true
  },
  extends: 'standard',
  overrides: [
    {
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script'
      }
    }
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    // Cho phép dùng cả ' và "
    quotes: ['warn', 'single', { avoidEscape: true, allowTemplateLiterals: true }],

    // Không bắt buộc hoặc cấm dấu ; (có cũng được, không cũng được)
    semi: ['off'],

    // Dấu phẩy cuối cùng không bắt buộc
    'comma-dangle': ['off'],

    // Cho phép khoảng trắng giữa dấu ngoặc { }
    'object-curly-spacing': ['warn', 'always'],

    // Cho phép console.log trong Node.js
    'no-console': 'off',

    // Không ép indent 2 spaces cứng nhắc (nhưng vẫn cảnh báo)
    indent: ['warn', 2],

    // Cho phép đặt biến nhưng không sử dụng
    'no-unused-vars': ['warn'],

    // Dễ chịu với async/await chưa xử lý lỗi
    'no-void': 'off'
  }
}

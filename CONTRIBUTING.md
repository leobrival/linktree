# Contributing

Thank you for your interest in contributing to the Personal Linktree project!

## How to Contribute

### Report Bugs

Found a bug? Please create an issue with:
- Description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Browser/device information

### Suggest Features

Have an idea? Create an issue describing:
- What you want to add
- Why it would be useful
- How it should work

### Code Contributions

Want to contribute code? Great!

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/your-feature`
3. **Make** your changes
4. **Test** your changes:
   ```bash
   pnpm build
   pnpm typecheck
   ```
5. **Commit** with clear messages: `git commit -m "Add feature X"`
6. **Push** to your fork: `git push origin feature/your-feature`
7. **Create** a Pull Request

## Development Setup

```bash
# Clone repository
git clone <url>
cd linktree

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Type checking
pnpm typecheck

# Build for production
pnpm build
```

## Code Guidelines

- Use TypeScript for type safety
- Follow existing code style
- Keep components small and focused
- Add comments for complex logic
- Use meaningful variable/function names

## Project Structure

```
src/
├── components/         # React components
├── pages/             # Page components
├── services/          # Data loading and API
├── hooks/             # Custom React hooks
└── styles/            # Global styles
```

## Areas for Contribution

### High Priority

- Improved error handling and messages
- Better mobile responsiveness
- Additional customization options
- Performance optimizations

### Nice to Have

- Dark mode support
- Animation improvements
- Additional UI components
- Internationalization (i18n)

### Documentation

- Improve existing guides
- Add troubleshooting sections
- Create video tutorials
- Translate documentation

## Testing

Manual testing checklist:

```bash
# 1. Development
pnpm dev
# - Test in Chrome, Firefox, Safari
# - Test on mobile (iOS, Android)
# - Test with slow network (DevTools → Network)

# 2. Build
pnpm build
# - Check console for errors/warnings
# - Verify bundle size

# 3. Production
pnpm preview
# - Test final build output
# - Check performance (Lighthouse)
```

## Commit Messages

Use clear, descriptive commit messages:

```
✨ Add dark mode support
🐛 Fix skeleton loader animation
📝 Update customization guide
🎨 Improve mobile styling
♻️ Refactor data validation
📦 Update dependencies
🚀 Optimize bundle size
```

## Pull Request Process

1. Update relevant documentation
2. Add tests if applicable
3. Ensure all checks pass
4. Provide clear PR description
5. Link to related issues

## Code Review

- Be open to feedback
- Respond constructively
- Test suggested changes
- Ask questions if unclear

## Questions?

- Check existing documentation
- Look at similar code for patterns
- Create an issue for discussion
- Email maintainer

## License

By contributing, you agree your code will be released under the MIT License.

Thank you for contributing! 🙏

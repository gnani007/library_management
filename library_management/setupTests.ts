import * as matchers from '@testing-library/jest-dom/matchers'
import { expect } from 'vitest'

// extend vitest's expect with jest-dom matchers
expect.extend(matchers)

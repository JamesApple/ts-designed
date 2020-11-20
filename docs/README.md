<!--panels:start-->
(...) - Awesome div wrapper
![GitHub Workflow Status (branch)](https://img.shields.io/github/workflow/status/jamesapple/ts-designed/build/master)
[![npm](https://img.shields.io/npm/v/designed.svg)](https://www.npmjs.com/package/designed)
[![npm](https://img.shields.io/npm/dt/designed.svg)](https://www.npmjs.com/package/designed)

# Designed

Designed is a TypeScript library to simplify building expressive, well-designed, domain driven services.

## Goals

<!--div:left-panel-->
1. **Replaceable**. Designed is easy to remove. Most DDD frameworks/libraries
	 want to take front and center in your application. Designed wants to help
	 you build easily understood and expressive services in the way that works
	 best for your team.
<!--div:right-panel-->
1. **Minimal Footprint**. Designed attempts to simplify the patterns that we
	 have found in production grade TypeScript apps. It also has a minimal import
	 list. Currently only importing tslib at runtime.
1. **Flexible**. Designed attempts to simplify standing up services using your
	 own project structure and domain language. It will never tie you to a
	 specific transport protocol or datastore.
1. **Product First**. Designed is focused on translating domain languages into
	 code in the fastest way possible.

<!--div:right-panel-->
## Installation

Install with your favourite package manager.

```
npm i designed
```

```
yarn add designed
```

## Modules

Designed is comprised of opt-in modules. You can use any of these without dependency on other designed modules.

[Simplify mapping, validation, and data transfer with Domain Entities. Inspired by MapStruct, DDD entities and ClassValidators](./docs/module/entity.md)
<!--panels:end-->

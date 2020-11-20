## Install

Install with your favourite package manager.

```sh
npm i designed
```

```sh
yarn add designed
```

### Optional Dependencies

#### reflect-metadata

If you want smarter types without needing to manually specify constructors install `reflect-metadata` and require it before your code runs

```sh
npm i reflect-metadata
```

```sh
yarn add reflect-metadata
```

```js
import 'reflect-metadata'
import { Entity } from 'designed'

class MyClass extends Entity.Base ...
```

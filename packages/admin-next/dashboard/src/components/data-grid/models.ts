import { Command } from "../../hooks/use-command-history"

export class Grid {
  private cells: boolean[][]

  constructor(rows: number, cols: number) {
    this.cells = Array.from({ length: rows }, () => Array(cols).fill(false))
  }

  // Register a cell when it is rendered and is not readonly
  registerCell(row: number, col: number, isNavigable: boolean) {
    if (this.isValidPosition(row, col)) {
      this.cells[row][col] = isNavigable
    }
  }

  // Check if a position is valid within the grid
  private isValidPosition(row: number, col: number): boolean {
    return (
      row >= 0 &&
      row < this.cells.length &&
      col >= 0 &&
      col < this.cells[0].length
    )
  }

  getValidMovement(
    row: number,
    col: number,
    direction: string,
    metaKey: boolean = false
  ): [number, number] {
    const [dRow, dCol] = this.getDirectionDeltas(direction)

    if (metaKey) {
      // Move to the last valid cell in the given direction
      return this.getLastValidCellInDirection(row, col, dRow, dCol)
    } else {
      // Move to the next valid cell in the given direction
      let newRow = row + dRow
      let newCol = col + dCol

      // Handle edge wrapping
      if (newCol < 0) {
        // Wrap to previous row, last column
        newRow -= 1
        newCol = this.cells[0].length - 1
      } else if (newCol >= this.cells[0].length) {
        // Wrap to next row, first column
        newRow += 1
        newCol = 0
      } else if (newRow < 0) {
        // Wrap to previous column, last row
        newCol -= 1
        newRow = this.cells.length - 1
      } else if (newRow >= this.cells.length) {
        // Wrap to next column, first row
        newCol += 1
        newRow = 0
      }

      // Validate new position and find next navigable cell
      while (
        this.isValidPosition(newRow, newCol) &&
        !this.cells[newRow][newCol]
      ) {
        newRow += dRow
        newCol += dCol
        // Adjust for edge wrapping again
        if (newCol < 0) {
          newRow -= 1
          newCol = this.cells[0].length - 1
        } else if (newCol >= this.cells[0].length) {
          newRow += 1
          newCol = 0
        } else if (newRow < 0) {
          newCol -= 1
          newRow = this.cells.length - 1
        } else if (newRow >= this.cells.length) {
          newCol += 1
          newRow = 0
        }
      }

      return this.isValidPosition(newRow, newCol)
        ? [newRow, newCol]
        : [row, col]
    }
  }

  // Get direction deltas based on the arrow key direction
  private getDirectionDeltas(direction: string): [number, number] {
    switch (direction) {
      case "ArrowUp":
        return [-1, 0]
      case "ArrowDown":
        return [1, 0]
      case "ArrowLeft":
        return [0, -1]
      case "ArrowRight":
        return [0, 1]
      default:
        return [0, 0]
    }
  }

  // Get the last valid cell in a given direction
  private getLastValidCellInDirection(
    row: number,
    col: number,
    dRow: number,
    dCol: number
  ): [number, number] {
    let newRow = row
    let newCol = col
    let lastValidRow = row
    let lastValidCol = col

    while (this.isValidPosition(newRow + dRow, newCol + dCol)) {
      newRow += dRow
      newCol += dCol
      if (this.cells[newRow][newCol]) {
        lastValidRow = newRow
        lastValidCol = newCol
      }
    }

    return [lastValidRow, lastValidCol]
  }
}

/**
 * A sorted set implementation that uses binary search to find the insertion index.
 */
export class SortedSet<T> {
  private items: T[] = []

  constructor(initialItems?: T[]) {
    if (initialItems) {
      this.insertMultiple(initialItems)
    }
  }

  insert(value: T): void {
    const insertionIndex = this.findInsertionIndex(value)

    if (this.items[insertionIndex] !== value) {
      this.items.splice(insertionIndex, 0, value)
    }
  }

  remove(value: T): void {
    const index = this.findInsertionIndex(value)

    if (this.items[index] === value) {
      this.items.splice(index, 1)
    }
  }

  getPrev(value: T): T | null {
    const index = this.findInsertionIndex(value)
    if (index === 0) {
      return null
    }

    return this.items[index - 1]
  }

  getNext(value: T): T | null {
    const index = this.findInsertionIndex(value)

    if (index === this.items.length - 1) {
      return null
    }

    return this.items[index + 1]
  }

  getFirst(): T | null {
    if (this.items.length === 0) {
      return null
    }

    return this.items[0]
  }

  getLast(): T | null {
    if (this.items.length === 0) {
      return null
    }

    return this.items[this.items.length - 1]
  }

  toArray(): T[] {
    return [...this.items]
  }

  private insertMultiple(values: T[]): void {
    values.forEach((value) => this.insert(value))
  }

  private findInsertionIndex(value: T): number {
    let left = 0
    let right = this.items.length - 1
    while (left <= right) {
      const mid = Math.floor((left + right) / 2)
      if (this.items[mid] === value) {
        return mid
      } else if (this.items[mid] < value) {
        left = mid + 1
      } else {
        right = mid - 1
      }
    }
    return left
  }
}

export type PasteCommandArgs = {
  selection: Record<string, boolean>
  next: string[]
  prev: string[]
  setter: (selection: Record<string, boolean>, values: string[]) => void
}

export class PasteCommand implements Command {
  private _selection: Record<string, boolean>

  private _prev: string[]
  private _next: string[]

  private _setter: (
    selection: Record<string, boolean>,
    values: string[]
  ) => void

  constructor({ selection, prev, next, setter }: PasteCommandArgs) {
    this._selection = selection
    this._prev = prev
    this._next = next
    this._setter = setter
  }

  execute(): void {
    this._setter(this._selection, this._next)
  }
  undo(): void {
    this._setter(this._selection, this._prev)
  }
  redo(): void {
    this.execute()
  }
}

export type UpdateCommandArgs = {
  prev: any
  next: any
  setter: (value: any) => void
}

export class UpdateCommand implements Command {
  private _prev: any
  private _next: any

  private _setter: (value: any) => void

  constructor({ prev, next, setter }: UpdateCommandArgs) {
    this._prev = prev
    this._next = next

    this._setter = setter
  }

  execute(): void {
    this._setter(this._next)
  }

  undo(): void {
    this._setter(this._prev)
  }

  redo(): void {
    this.execute()
  }
}

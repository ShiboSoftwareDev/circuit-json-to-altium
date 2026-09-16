import { expect, test } from "bun:test"
import { parseAltiumPcbDoc } from "altiumts"
import { createPcbDocument } from "../lib/create-pcb-document"
import { board, type CircuitElement } from "./fixtures"

test("exports pill and rounded-rectangle SMT pad shapes", () => {
  const elements: CircuitElement[] = [
    board(),
    {
      type: "pcb_smtpad",
      pcb_smtpad_id: "pill_top",
      shape: "pill",
      x: -2,
      y: 0,
      width: 2,
      height: 1,
      radius: 0.5,
      layer: "top",
    },
    {
      type: "pcb_smtpad",
      pcb_smtpad_id: "rounded_bottom",
      shape: "rect",
      x: 0,
      y: 0,
      width: 2,
      height: 1,
      corner_radius: 0.2,
      layer: "bottom",
    },
    {
      type: "pcb_smtpad",
      pcb_smtpad_id: "circle_top",
      shape: "circle",
      x: 2,
      y: 0,
      radius: 0.5,
      layer: "top",
    },
  ]

  const document = parseAltiumPcbDoc(createPcbDocument(elements))
  const [pill, rounded, circle] = document.getRecordsByKind("Pad")

  expect(pill?.get("SHAPE")).toBe("RECTANGLE")
  expect(pill?.get("LAYER0ALTSHAPE")).toBe("ROUNDRECT")
  expect(pill?.getNumber("LAYER0CORNERRADIUS")).toBe(100)
  expect(rounded?.get("SHAPE")).toBe("RECTANGLE")
  expect(rounded?.get("LAYER31ALTSHAPE")).toBe("ROUNDRECT")
  expect(rounded?.getNumber("LAYER31CORNERRADIUS")).toBe(40)
  expect(circle?.get("SHAPE")).toBe("ROUND")
})

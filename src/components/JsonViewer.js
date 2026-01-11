import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function PropValue({ prop, value }) {
  return (<>
    <div className="grid gap-3">
      <Label htmlFor="name-1">{prop}</Label>
      <Input id="name-1" name="name" defaultValue={value} />
    </div>

  </>)
}

export default function JsonViewer({ json }) {
  return (<>
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline">Open Dialog</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Json Viewer</DialogTitle>
            <DialogDescription>
              Edit the json
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            {Object.entries(json).map(([prop, value], index) => (
              <PropValue key={index} prop={prop} value={value} />
            ))}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  </>)
}
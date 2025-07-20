import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { DialogContent } from "@radix-ui/react-dialog";
import { Plus } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

const Shortcuts = () => {
  const [uri, setUri] = useState("");
  const [name, setName] = useState("");
  // const [favicon, setFavicon] = useState("");
  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="ghost">
          {" "}
          <Plus />
        </Button>{" "}
      </DialogTrigger>
      <DialogContent className="w-full border rounded-xl p-24 bg-red-500 bg-opacity-40">
        <DialogHeader>
          <DialogTitle>Add Shortcut</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-5">
          <Label>Name</Label>

          <Input
            type="text"
            value={name}
            placeholder="Cosync Labs"
            onChange={(e) => {
              setName(e.target.value);
            }}
          />

          <Label>Url</Label>
          <Input
            type="url"
            placeholder="https://cosynclabs.com"
            value={uri}
            onChange={(e) => {
              setUri(e.target.value);
              // setFavicon(uri + "/favicon.ico");
            }}
          />
        </div>

        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Shortcuts;

"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";

type ImageUploadProps = {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
};

const ImageUpload = ({
  disabled,
  onChange,
  onRemove,
  value,
}: ImageUploadProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onUpload = (result: any) => {
    onChange(result.info.secure_url);
  };

  if (!isMounted) return null;

  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        {value.map((url) => (
          <div
            key={url}
            className="relative w-[200px] h-[200px] rounded-md overflow-hidden"
          >
            <div className="z-10 absolute top-2 right-2">
              <Button
                onClick={() => onRemove(url)}
                variant="destructive"
                size="icon"
              >
                <Icons.trash className="h-4 w-4" />
              </Button>
            </div>
            <Image fill className="object-cover" alt="Image" src={url} />
          </div>
        ))}
      </div>
      <CldUploadWidget onUpload={onUpload} uploadPreset="y9u2iftn">
        {({ open }) => {
          const onClick = () => {
            open();
          };

          return (
            <Button disabled={disabled} onClick={onClick} variant="secondary">
              <Icons.addImage className="h-4 w-4 mr-2" />
              Upload
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
};

export default ImageUpload;

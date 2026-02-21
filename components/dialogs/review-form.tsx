"use client"

import { useAuth } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { createReview } from "@/app/actions/general";
import { ReviewFormValues, reviewSchema } from "@/lib/schema";
import { cn } from "@/lib/utils";
import { Plus, StarIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Textarea } from "../ui/textarea";



export const ReviewForm = ({ staffId }: { staffId: string }) => {
  const router = useRouter();
  const { userId } = useAuth(); // correct extraction of userId
  const [loading, setLoading] = useState(false);

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      patient_id: userId ?? "",
      staff_id: staffId,
      rating: 1,
      comment: "",
    },
  });

  const handleSubmit = async (values: ReviewFormValues) => {
    try {
      setLoading(true);
      const response = await createReview(values);

      if (response?.success) {
        toast.success(response.message);
        router.refresh();
        form.reset(); // reset form after successful submission
      } else {
        toast.error(response?.message || "Failed to create review");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to create review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="px-4 py-2 rounded-lg bg-black/10 text-black hover:bg-transparent font-light"
        >
          <Plus /> Add New Review
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Review</DialogTitle>
          <DialogDescription>
            Fill in the form below to add a new review
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button" // prevent form submit on click
                          onClick={() => field.onChange(star)}
                          className={cn(
                            star <= field.value ? "text-yellow-500 fill-yellow-500" : "text-gray-500"
                          )}
                        >
                          <StarIcon />
                        </button>
                      ))}
                    </div>
                  </FormControl>
                  <FormDescription>Please rate the staff based on your experience</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comment</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Write your review here" {...field} className="resize-none" />
                  </FormControl>
                  <FormDescription>Please write a detailed review about your experience</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

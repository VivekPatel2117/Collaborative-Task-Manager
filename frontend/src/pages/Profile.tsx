import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  profileSchema,
  type ProfileFormValues,
} from "@/lib/validators/profile.schema";
import {
  getProfile,
  updateProfile,
} from "@/services/profile.service";

export default function Profile() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    values: {
      name: data?.name ?? "",
      email: data?.email ?? "",
    },
  });

  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["me"] }); 
    },
  });

  if (isLoading) {
    return <div className="p-6">Loading profile...</div>;
  }

  return (
    <div className="max-w-xl p-6">
      <h1 className="text-2xl font-semibold mb-6">
        Profile
      </h1>

      <Card>
        <CardContent className="p-6 space-y-4">
          <form
            onSubmit={form.handleSubmit((values) =>
              mutation.mutate(values)
            )}
            className="space-y-4"
          >
            {/* NAME */}
            <div>
              <label className="text-sm font-medium">
                Full Name
              </label>
              <Input {...form.register("name")} />
              {form.formState.errors.name && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            {/* EMAIL */}
            <div>
              <label className="text-sm font-medium">
                Email
              </label>
              <Input {...form.register("email")} />
              {form.formState.errors.email && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={mutation.isPending}
            >
              {mutation.isPending
                ? "Saving..."
                : "Save Changes"}
            </Button>

            {mutation.isError && (
              <p className="text-sm text-red-500">
                Failed to update profile
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface MainFeatureCardProps {
  title: string;
  description: string;
}

export default function MainFeatureCard({
  title,
  description,
}: MainFeatureCardProps) {
  return (
    <Card className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="p-0"></CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-xl font-semibold text-gray-800">
          {title}
        </CardTitle>
        <CardDescription className="text-gray-600 mt-2">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
}

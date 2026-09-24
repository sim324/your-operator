import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";

// Who the demo is signed in as. Display only: there are no account actions
// in the demo, so it's a plain outlined Item rather than a menu button.
export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  return (
    <Item variant="outline" size="sm">
      <ItemContent className="min-w-0">
        <ItemTitle>{user.name}</ItemTitle>
        <ItemDescription className="truncate text-xs">
          {user.email}
        </ItemDescription>
      </ItemContent>
    </Item>
  );
}

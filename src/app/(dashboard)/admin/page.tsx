import { getSession } from "@/lib/get-session";
//COMPOMENTS
import { UsersTable } from "@/components/table/UsersTable";
import { IUserResponse, IUsersData } from "@/lib/types/User";

/**
 * Fetches users data from the API
 * Note: Session is already validated by middleware (proxy.ts) for /admin routes
 * Using getSession() here benefits from React cache() deduplication
 */
const getUsersData = async (): Promise<{
  success: boolean;
  data?: IUsersData[];
  message?: string;
}> => {
  // Session guaranteed by middleware - using cached getSession()
  const session = (await getSession())!;
  const token = session.token;

  try {
    const res = await fetch(`${process.env.FRONTEND_URL}/api/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      next: {
        revalidate: 0,
        tags: ["users"],
      },
    });

    if (!res.ok) {
      return {
        success: false,
        message: "Failed to fetch users data",
      };
    }

    const usersData: IUserResponse<IUsersData[]> = await res.json();
    if (!usersData.success) {
      return {
        success: false,
        message: usersData.message || "Failed to fetch users data",
      };
    }

    return {
      success: true,
      data: usersData.data ?? undefined,
    };
  } catch (error) {
    console.error("Error fetching users data:", error);
    return {
      success: false,
      message: "Error fetching users data",
    };
  }
};

const AdminPage = async () => {
  // Session guaranteed by middleware - cache() ensures single call even with getUsersData
  const session = (await getSession())!;
  const token = session.token;

  const usersData = await getUsersData();
  if (!usersData.success) {
    return <div>No users data available</div>;
  }

  return (
    <>
      <div className=" mx-auto py-10">
        <h1 className="text-lg font-bold">Profile</h1>
        <UsersTable usersData={usersData.data!} token={token} />
      </div>
    </>
  );
};

export default AdminPage;

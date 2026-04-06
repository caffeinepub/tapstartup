import Migration "migration";
import Text "mo:core/Text";
import Set "mo:core/Set";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";

// Use persistent actor with explicit migration
(with migration = Migration.run)
actor {
  // Admin Principal is anonymous user ("2vxsx-fae") by default
  let admin = Principal.fromText("2vxsx-fae");
  // Initialize subscribers with a default address
  let subscribers = Set.singleton("demo@icp.land");

  // Add subscriber if not in set, else trap
  public shared ({ caller }) func addSubscriber(email : Text) : async () {
    if (subscribers.contains(email)) {
      Runtime.trap("Email is already subscribed");
    };
    subscribers.add(email);
  };

  // Only admin can access all subscribers
  public shared ({ caller }) func getAllSubs() : async [Text] {
    if (caller != admin) {
      Runtime.trap("Only admin can access all email addresses");
    };
    subscribers.values().toArray();
  };
};

import Text "mo:base/Text";
import Array "mo:base/Array";
import Nat "mo:base/Nat";
import Debug "mo:base/Debug";
import Bool "mo:base/Bool";
import RbTree "mo:base/RBTree";
import Iter "mo:base/Iter";
actor TodoApp {
  type todo = {
    task : Text;
    isCompleted : Bool;
  };
  var tasks = RbTree.RBTree<Nat, todo>(Nat.compare);

  public query func fetchAllData() : async [(Nat, todo)] {
    return Iter.toArray(tasks.entries());
  };

  public func addData(task : Text, isCompleted : Bool) : async Bool {
    tasks.put(RbTree.size(tasks.share())+1, { task; isCompleted });
    return true;
  };

  public func removeData(task : Text) : async Nat {
    //remove the particular task when the task is matched
    var taskList = Iter.toArray(tasks.entries());
    var isAnythingRemoved = false;
    var removedId : Nat = 0;
    for (_task in taskList.vals()) {
      let (id, todo) = _task;
      if (todo.task == task) {
        tasks.delete(id);
        removedId := id;
        isAnythingRemoved := true;
      };
    };
    if isAnythingRemoved {
      return removedId;
    };
    return 999999599;
  };

  public func updateData(task : Text, isCompleted : Bool) : async Bool {
    var taskList = Iter.toArray(tasks.entries());
    var fData = [];
    for (_task in taskList.vals()) {
      let (id, todo) = _task;
      if (todo.task == task) {
        tasks.delete(id);
        tasks.put(id, { task; isCompleted });
      };
    };
    return true;
  };

  public func resetData() : async Text {
    //remove all tasks
    var taskList = Iter.toArray(tasks.entries());
    var removedTasks = 0;
    for (_task in taskList.vals()) {
      let (id, todo) = _task;
      tasks.delete(id);
      removedTasks := removedTasks + 1;
    };
    return "Removed " #debug_show (removedTasks) # " tasks!";
  };
};

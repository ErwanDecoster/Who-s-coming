export {};

declare global {
  interface Message {
    type: string;
    content: string;
  }
  
  interface event {
    id_evenement: number;
    created_at: Date;
    update_at: Date;
    name: string;
    address: string;
    desc: string
    rules: string;
    user_id: string;
    datetime: Date;
    needs: need[];
  }
 
  interface need {
    label: string;
    id_need: number;
    created_at: Date;
    max_number: number;
    id_evenement: number;
    min_required_number: number;
    need_invitations: need_invitation[]
  }

  interface need_invitation {
    id: number;
    needs: need[];
    need: need;
    id_need: number;
    created_at: Date;
    id_invitation: number;
    invitation: invite;
  }

  interface invite {
    id_invitation: number;
    created_at: Date;
    id_evenement: number;
    id_state: number;
    state_change_date: Date;
    code: string;
    first_name: string;
    surname: string;
    tel: string;
    relationship: string;
    id_invitation_asker: number;
    asked_by: invite;
    need_invitations: need_invitation[];
  }
  
  interface invites_by_state {
    1: invite[];
    2: invite[];
    3: invite[];
    4: invite[];
    5: invite[];
    6: invite[];
  }

  interface asked_invites_by_state {
    1: invite[];
    2: invite[];
    3: invite[];
    4: invite[];
    5: invite[];
    6: invite[];
  }

}
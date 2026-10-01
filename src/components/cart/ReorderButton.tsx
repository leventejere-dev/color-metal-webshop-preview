import { useNavigate } from 'react-router-dom';
import { Repeat } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { MAX_ONLINE_QTY } from '@/config/pricing';
import type { Order } from '@/lib/types';

/**
 * „Comandă din nou” – pune din nou în coș produsele dintr-o comandă anterioară.
 *
 * Plăcile din promoție (AluShop) sunt bucăți unice: odată vândute, nu se mai pot comanda,
 * deci sunt sărite, iar clientul este anunțat. Restul produselor se adaugă cu aceeași
 * configurație și cantitate (în limita comenzii online).
 */
export function ReorderButton({ order, size = 'sm', variant = 'secondary', full }: { order: Order; size?: 'sm' | 'md' | 'lg'; variant?: 'primary' | 'secondary' | 'ghost'; full?: boolean }) {
  const { add } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  const again = order.items.filter((i) => i.source !== 'alushop');
  const skipped = order.items.length - again.length;

  const run = () => {
    for (const { id: _id, addedAt: _addedAt, ...rest } of again) {
      add({ ...rest, quantity: Math.min(rest.quantity, MAX_ONLINE_QTY) });
    }
    const n = again.length;
    toast(
      skipped > 0
        ? `${n} ${n === 1 ? 'produs a fost adăugat' : 'produse au fost adăugate'} în coș. ${skipped === 1 ? 'O bucată unică din promoție a fost' : `${skipped} bucăți unice din promoție au fost`} sărită${skipped === 1 ? '' : 'e'} – se vinde o singură dată.`
        : `${n} ${n === 1 ? 'produs a fost adăugat' : 'produse au fost adăugate'} în coș.`,
    );
    navigate('/cos');
  };

  if (again.length === 0) {
    return (
      <Button size={size} variant={variant} full={full} disabled title="Comanda conține doar bucăți unice din promoție, care se vând o singură dată.">
        <Repeat className="h-4 w-4" /> Comandă din nou
      </Button>
    );
  }

  return (
    <Button size={size} variant={variant} full={full} onClick={run}>
      <Repeat className="h-4 w-4" /> Comandă din nou
    </Button>
  );
}
